require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

const generateId = () => {
    return Math.floor(Math.random()*100)+1
}

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', function (req,res) {return JSON.stringify(req.body)})

app.use(morgan('tiny',{
    skip: function (req,res) {return req.method==='POST'}
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body', {
    skip: function (req,res) {return req.method!=='POST'}
}))

app.get("/api/persons",(request,response) => {
    Person.find({}).then(result=> {
        response.json(result)
    })
})

app.get('/info', (request,response) => {
    const res = `
        <p>Phonebook has info for ${persons.length} people.</p>
        <br/>
        <p>${Date()}</p>`
    response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person=>{
        if(person) {
            response.json(person)
        } else {
            response.status(404)
            response.end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p=>p.id!==id)
    response.status(204)
    response.end()
})

app.post('/api/persons', (request,response) => {
    const person = new Person(request.body)

    // if(!person.name) {
    //     return response.status(400).json({
    //         error: "name missing"
    //     })
    // } else if (!person.number) {
    //     return response.status(400).json({
    //         error: "number missing"
    //     })
    // } else if (persons.find(p=>p.name===person.name)) {
    //     return response.status(400).json({
    //         error: `person with name ${person.name} is already present`
    //     })
    // }

    // const id = generateId()
    // person.id=id
    
    person.save().then(result=>{
        response.json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
