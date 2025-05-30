import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../shared/database";

export type UserRole = "user" | "admin";

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "created_at" | "role"
>;

class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  created_at!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default UserModel;
