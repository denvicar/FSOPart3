const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@cluster0.mcnv3.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person',personSchema)

const addPerson = (name,number) => {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

const getPeople = () => {
    Person.find({}).then(result=>{
        result.forEach(person=>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length === 5) {
    addPerson(process.argv[3],process.argv[4])
} else {
    getPeople()
}

