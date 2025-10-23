import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ValeDetalleAttributes {
  id: number;
  valeId: number;
  sku: string;
  cajas: number;
  bandejas: number;
  unidades: number;
  totalUnidades: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ValeDetalleCreationAttributes extends Optional<ValeDetalleAttributes, "id"> {}

export class ValeDetalle extends Model<ValeDetalleAttributes, ValeDetalleCreationAttributes> implements ValeDetalleAttributes {
  public id!: number;
  public valeId!: number;
  public sku!: string;
  public cajas!: number;
  public bandejas!: number;
  public unidades!: number;
  public totalUnidades!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ValeDetalle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    valeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vales",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cajas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bandejas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unidades: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalUnidades: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "vale_detalles",
    timestamps: true
  }
);
