import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../shared/database";

export interface BookAttributes {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publication_year: number;
  file_url: string;
  image_url: string;
  pagesCount: number;
  created_at: Date;
}

export interface BookCreationAttributes
  extends Optional<BookAttributes, "id" | "created_at"> {}

export class BookModel
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: string;
  public title!: string;
  public author!: string;
  public genre!: string;
  public description!: string;
  public publication_year!: number;
  public file_url!: string;
  public image_url!: string;
  public pagesCount!: number;
  public created_at!: Date;
}

BookModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publication_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pagesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "books",
    timestamps: false,
    underscored: true,
  }
);

export default BookModel;
