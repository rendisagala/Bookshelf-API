const books = require("../database/books");
const { nanoid } = require("nanoid");

exports.addBook = [
  (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    if (name === undefined) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    } else if (pageCount < readPage) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    } else {
      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = readPage === pageCount;

      const addedBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };
      books.push(addedBook);

      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          book,
        },
      });
      response.code(201);
      return response;
    }
  },
];

exports.getAllBooks = [
  (request, h) => {
    const { name, reading, finished } = request.query;

    if (name !== undefined) {
      const response = h.response({
        status: "success",
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    } else if (reading !== undefined) {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((book) => book.reading === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else if (finished !== undefined) {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((book) => book.finished === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    }
  },
];

exports.getBookDetail = [
  (request, h) => {
    const { bookId } = req.params;
    const checkBookById = books.filter((book) => book.id === bookId)[0];

    if (checkBookById !== undefined) {
      const response = h.response({
        status: "success",
        data: {
          book: book,
        },
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  },
];

exports.updateBook = [
  (request, h) => {
    const { bookId } = req.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    const index = books.findIndex((book) => book.id === bookId);

    if (name === undefined) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    } else if (pageCount < readPage) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    } else if (index === -1) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
      response.code(400);
      return response;
    } else {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished: pageCount === readPage,
        updatedAt: new Date().toString(),
      };
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }
  },
];

exports.deleteBook = [
  (request, h) => {
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  },
];
