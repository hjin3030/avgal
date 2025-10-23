import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MermaAttributes {
  id: number;
  fecha: string;
  peso: number;
  unidades: number;
  operadorId: number;
  operador: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MermaCreationAttributes extends Optional<MermaAttributes, "id"> {}

export class Merma extends Model<MermaAttributes, MermaCreationAttributes> implements MermaAttributes {
  public id!: number;
  public fecha!: string;
  public peso!: number;
  public unidades!: number;
  public operadorId!: number;
  public operador!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Merma.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    peso: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unidades: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operadorId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    operador: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "merma",
    timestamps: true
  }
);
