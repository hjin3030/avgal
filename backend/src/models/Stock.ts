import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface StockAttributes {
  id: number;
  sku: string;
  cajas: number;
  bandejas: number;
  unidades: number;
  totalUnidades: number;
  pabellon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StockCreationAttributes extends Optional<StockAttributes, "id"> {}

export class Stock extends Model<StockAttributes, StockCreationAttributes> implements StockAttributes {
  public id!: number;
  public sku!: string;
  public cajas!: number;
  public bandejas!: number;
  public unidades!: number;
  public totalUnidades!: number;
  public pabellon?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Stock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
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
      allowNull: false,
      defaultValue: 0
    },
    pabellon: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "stock",
    timestamps: true
  }
);
