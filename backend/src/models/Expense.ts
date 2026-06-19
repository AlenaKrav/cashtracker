import {Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from 'sequelize-typescript'
import Budget from './Budget'

@Table({
    tableName: 'expenses'
})

class Expense extends Model{
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER()
    })
    declare amount: number

    //definimos la FK
    @ForeignKey(() => Budget)
    declare budgetId: number

    //Indicamos que un gasto pertenecerá a un presupuesto
    @BelongsTo(() => Budget)
    declare budget: Budget
}

export default Expense