import { Data, DataDetail, DataManager, FigmaWidget } from "./Common";

type Name = string;
type Age = number;
type Location = string;
type Occupation = string;
type Status = string;
type Education = string;
type PersonaType = string;

type UpdateSource = "source" | "widget";

type BioDataField<T> = {
  value: T;
  updated: UpdateSource;
}

type BioData = {
  type: BioDataField<PersonaType>;
  name: BioDataField<Name>;
  age: BioDataField<Age>;
  location: BioDataField<Location>;
  occupation: BioDataField<Occupation>;
  status: BioDataField<Status>;
  education: BioDataField<Education>;
};

type BlockTitle = "Motivation" | "Frustration" | "Goal" | "Story";
type BlockDetail = string;
type Block = { 
  title: BlockTitle;
  detail: BlockDetail;
  updated: UpdateSource;
};

class PersonaDetail implements DataDetail<"Persona"> {
  bio_data: BioData;
  blocks: Block[];

  constructor(bio_data: BioData, blocks: Block[]) {
    this.bio_data = bio_data;
    this.blocks = blocks;
  }
}

class PersonaData implements Data<"Persona"> {
  id: String;
  detail: DataDetail<"Persona">;

  constructor(id: String, detail: DataDetail<"Persona">) {
    this.id = id;
    this.detail = detail;
  }
}

class PersonaManager implements DataManager<"Persona", "Note"> {
  all_data: Data<"Persona">[];

  constructor() {
    this.all_data = [];
  }

  create(a: DataDetail<"Persona">): Data<"Persona"> {
    throw new Error("Method not implemented.");
  }
  update_from_source(
    source: Data<"Note">[],
    origin: Data<"Persona">
  ): Data<"Persona"> {
    throw new Error("Method not implemented.");
  }
  update_from_widget(
    widget: FigmaWidget<"Persona">,
    origin: Data<"Persona">
  ): Data<"Persona"> {
    throw new Error("Method not implemented.");
  }
  render(a: Data<"Persona">): FigmaWidget<"Persona"> {
    throw new Error("Method not implemented.");
  }
}

/*
Primary personas = these are the main targets of decision-making, i.e., the customers or users of a product. For example, the highest-paying customers.

Secondary personas = these are personas that have additional needs for which you can adjust the product or service, without harming the experience of the primary personas. For example, visually impaired users (e.g., you can increase the font size without it affecting negatively the user experience of primary users — many accessibility best practices fall into this category).

Served personas = these are personas that are not customers or users of your company, but are affected by the use of the product. For example, say your personas describe receptionists at a hotel. Served personas would be the customers of the receptionists. Essentially, the clients of your client.

Anti-personas = these are users or customers that are not the users of the product or services of your company, and are not directly affected by the product either. For example, a hotel cleaner would most likely not be affected by the work of the receptionist directly. Sometimes, thinking of who the persona is not helps flesh out the parts that make the persona unique.
*/

export {PersonaData, PersonaDetail, PersonaManager, Block, BioData}
