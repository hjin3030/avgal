import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ValeAttributes {
  id: number;
  fecha: string;
  fechaCreacion: Date;
  tipo: "ingreso" | "egreso" | "reingreso";
  origen: string;
  destino: string;
  estado: "pendiente" | "validado" | "rechazado" | "anulado";
  pabellonNombre: string;
  operadorId: number;
  operadorNombre: string;
  totalUnidadesEmpaquetadas: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ValeCreationAttributes extends Optional<ValeAttributes, "id"> {}

export class Vale extends Model<ValeAttributes, ValeCreationAttributes> implements ValeAttributes {
  public id!: number;
  public fecha!: string;
  public fechaCreacion!: Date;
  public tipo!: "ingreso" | "egreso" | "reingreso";
  public origen!: string;
  public destino!: string;
  public estado!: "pendiente" | "validado" | "rechazado" | "anulado";
  public pabellonNombre!: string;
  public operadorId!: number;
  public operadorNombre!: string;
  public totalUnidadesEmpaquetadas!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vale.init(
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
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    tipo: {
      type: DataTypes.ENUM("ingreso", "egreso", "reingreso"),
      allowNull: false
    },
    origen: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    destino: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "validado", "rechazado", "anulado"),
      allowNull: false,
      defaultValue: "pendiente"
    },
    pabellonNombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    operadorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operadorNombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    totalUnidadesEmpaquetadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: "vales",
    timestamps: true
  }
);
