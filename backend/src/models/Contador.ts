import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ContadorAttributes {
  id: number;
  pabellon: string;
  fecha: string;
  linea: string;
  cara: number;
  valor: number;
  nombre: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContadorCreationAttributes extends Optional<ContadorAttributes, "id"> {}

export class Contador extends Model<ContadorAttributes, ContadorCreationAttributes> implements ContadorAttributes {
  public id!: number;
  public pabellon!: string;
  public fecha!: string;
  public linea!: string;
  public cara!: number;
  public valor!: number;
  public nombre!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contador.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pabellon: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    linea: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    cara: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "contadores",
    timestamps: true
  }
);
