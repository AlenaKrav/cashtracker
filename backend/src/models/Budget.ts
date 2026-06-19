import {Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from 'sequelize-typescript'
import Expense from './Expense'
import User from './User'

//Definimos una tabla
@Table({
    //Este modelo se corresponde con una tabla llamada budgets
    tableName: 'budgets'
})

/**
 * Aquí defines una clase TypeScript. 
 * Pero no es una clase cualquiera.
 * Al extender de Model obtiene toda la funcionalidad ORM de Sequelize
 * Además la clase Budget es la representación orientada a objetos de esa tabla dentro de tu aplicación
 * */
class Budget extends Model {
    //Definimos una columna SQL
    //Describe cómo debe ser la columna asociada a la propiedad que viene justo debajo
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    //propiedad de la propiedad del modelo en Typescript, y por tanto el nombre de la columna en postgres
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER()
    })
    declare amount: number


    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    declare expenses: Expense[]

    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare user: User
}

export default Budget