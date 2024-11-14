import { Data, DataDetail, DataManager, FigmaWidget } from "./Common";

class NullDetail implements DataDetail<"Null"> {}
class NullData implements Data<"Null"> {
  id: string;
  detail: NullDetail;

  constructor(id: string, detail: NullDetail) {
    this.id = id;
    this.detail = detail;
  }
}

class NoteDetail implements DataDetail<"Note"> {
  name: string;
  content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

class NoteData implements Data<"Note"> {
  id: string;
  detail: NoteDetail;

  constructor(id: string, detail: NoteDetail) {
    this.id = id;
    this.detail = detail;
  }
}

class NoteManager implements DataManager<"Note", "Null"> {
  all_data: Data<"Note">[];

  constructor() {
    this.all_data = [];
  }
  create(a: DataDetail<"Note">): Data<"Note"> {
    throw new Error("Method not implemented.");
  }
  update_from_source(
    source: Data<"Null">[],
    origin: Data<"Note">
  ): Data<"Note"> {
    throw new Error("Method not implemented.");
  }
  update_from_widget(
    widget: FigmaWidget<"Note">,
    origin: Data<"Note">
  ): Data<"Note"> {
    throw new Error("Method not implemented.");
  }
  render(a: Data<"Note">): FigmaWidget<"Note"> {
    throw new Error("Method not implemented.");
  }
}

export { NoteData, NoteDetail };
