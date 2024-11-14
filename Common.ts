/*
Data Layer
*/
interface DatabaseManager {
  save(): void;
  read(): void;
  listen(): void;
}

/*
Business Layer
*/

type UUID = String;

type DataType = "Null" | "Note" | "Persona" | "UserStory" | "UserJourneyMap";

interface FigmaWidget<T extends DataType> {}

interface DataDetail<T extends DataType> {}

interface Data<T extends DataType> {
  id: UUID;
  detail: DataDetail<T>;
}

interface DataManager<T1 extends DataType, T2 extends DataType> {
  all_data: Data<T1>[];

  // business logic for single data and widget
  create(a: DataDetail<T1>): Data<T1>;
  update_from_source(source: Data<T2>[], origin: Data<T1>): Data<T1>;
  update_from_widget(widget: FigmaWidget<T1>, origin: Data<T1>): Data<T1>;
  render(a: Data<T1>): FigmaWidget<T1>;
}

abstract class DataManagerHelper {
  find_latest: any;
}

export { FigmaWidget, DataDetail, Data, DataManager };
