const express = require('express')

const app = express()

const generateId = () => {
    return Math.floor(Math.random()*100)+1
}

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons",(request,response) => {
    response.json(persons)
})

app.get('/info', (request,response) => {
    const res = `
        <p>Phonebook has info for ${persons.length} people.</p>
        <br/>
        <p>${Date()}</p>`
    response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p=>p.id===id)

    if(person) {
        response.json(person)
    } else {
        response.status(404)
        response.end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p=>p.id!==id)
    response.status(204)
    response.end()
})

app.post('/api/persons', (request,response) => {
    const person = request.body

    if(!person.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (!person.number) {
        return response.status(400).json({
            error: "number missing"
        })
    } else if (persons.find(p=>p.name===person.name)) {
        return response.status(400).json({
            error: `person with name ${person.name} is already present`
        })
    }

    const id = generateId()
    person.id=id
    persons = persons.concat(person)
    response.json(person)
})

app.listen(3001, () => {
    console.log("Server started on port 3001")
})