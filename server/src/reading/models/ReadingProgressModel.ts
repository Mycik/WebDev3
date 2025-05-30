import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../shared/database";
import UserModel from "../../user/models/UserModel";
import BookModel from "../../book/models/BookModel";

export interface ReadingProgressAttributes {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  updated_at: Date;
}

export interface ReadingProgressCreationAttributes
  extends Optional<ReadingProgressAttributes, "id" | "updated_at"> {}

export class ReadingProgressModel
  extends Model<ReadingProgressAttributes, ReadingProgressCreationAttributes>
  implements ReadingProgressAttributes
{
  public id!: string;
  public user_id!: string;
  public book_id!: string;
  public current_page!: number;
  public updated_at!: Date;
}

ReadingProgressModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: UserModel, key: "id" },
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: BookModel, key: "id" },
    },
    current_page: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "reading_progress",
    timestamps: false,
    underscored: true,
  }
);

export default ReadingProgressModel;
