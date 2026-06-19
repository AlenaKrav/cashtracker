import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  Unique,
  HasMany,
} from "sequelize-typescript";
import Expense from "./Budget";
import Budget from "./Budget";

@Table({
  tableName: "users",
})
class User extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare name: string;


  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare password: string;

  

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(50),
  })
  declare email: string;


  @Column({
    type: DataType.STRING(6),
  })
  declare token: string;

  //Antes de declarar la columna
  //Indicamos las propiedades que se le aplicarán a esta
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirmed: boolean;

  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare budgets: Budget[];
}

export default User;
