const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

router.get('/', async (req, res) => {
  res.send('All books')
})

router.get('/new', async (req, res) => {
  try {
    const authors = await Author.find({})
    res.render('books/new', { book: new Book(), authors: authors })
  } catch {}
})

router.post('/', async (req, res) => {
  res.send('Create books')
})

module.exports = router
