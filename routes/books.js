const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png']
const fs = require('fs')
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  },
})

router.get('/', async (req, res) => {
  res.send('All books')
})

router.get('/new', async (req, res) => {
  renderNewPage(res, new Book({}))
})

router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  })

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch (error) {
    if (book.coverImageName != null) removeBookCover(book.coverImageName)
    renderNewPage(res, book, true)
  }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = { book: new Book(), authors: authors }
    if (hasError) {
      params.errorMessage = 'Error Creating Book'
    }
    res.render('books/new', params)
  } catch {}
}

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.log(err)
  })
}

module.exports = router
