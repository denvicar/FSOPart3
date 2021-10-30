require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

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


app.get('/api/persons',(request,response,next) => {
    Person.find({}).then(result=> {
        response.json(result)
    }).catch(error=>next(error))
})

app.get('/info', (request,response,next) => {
    Person.find({}).then(personList=>{
        const res = `
        <p>Phonebook has info for ${personList.length} people.</p>
        <br/>
        <p>${Date()}</p>`
        response.send(res)
    }).catch(error=>next(error))
    
})

app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id).then(person=>{
        if(person) {
            response.json(person)
        } else {
            response.status(404)
            response.end()
        }
    }).catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id,person, {new: true, runValidators: true})
        .then(updatedPerson=>{
            response.json(updatedPerson)
        })
        .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndRemove(request.params.id).then(()=>{
        response.status(204).end()
    }).catch(error=>next(error))
})

app.post('/api/persons', (request,response,next) => {
    const person = new Person(request.body)
    
    person.save().then(result=>{
        response.json(result)
    }).catch(error=>next(error))
})

const errorHandler = (error,request,response,next) => {
    console.log(error.message)

    if(error.name==='CastError') {
        response.status(400)
        response.send({error: 'malformed id'})
    } else if (error.name==='ValidationError') {
        response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
