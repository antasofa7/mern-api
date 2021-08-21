const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file) {
        const err = new Error('Image harus diupload!');
        err.status = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {uid: 1, name: 'Antasofa'}
    })

    Posting.save()
    .then(result => {
        res.status(201).json({
            message: 'Create blog post success!',
            data: result
        });

    }).catch(err => {
        console.log('err >>', err)
    });
}

exports.getAllBlogPost = (req, res, next) => {
    BlogPost.find()
    .then(result => {
        res.status(200).json({
            message: 'Data blog post berhasil dipanggil',
            data: result
        })
    })
    .catch(err => next(err))
}

exports.getAllBlogPostById = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(result => {
        if(!result) {
            const error = new Error('Blog post tidak ditemukan.');
            error.errorStatus = 400;
            throw err;
        }
        res.status(200).json({
            message: 'Data blog post berhasil dipanggil',
            data: result
        })
    })
    .catch(err => next(err))
}

exports.updateBlogPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file) {
        const err = new Error('Image harus diupload!');
        err.status = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Blog post tidak ditemukan')
            err.errorStatus = 404;
            throw err;
        }

        post.title = title;
        post.body = body;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update blog post sukses',
            data: result
        })
    })
    .catch(err => next(err))

}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Blog post tidak ditemukan')
            err.errorStatus = 404;
            throw err;
        }

        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Hapus blog post berhasil',
            data: result
        })
    })
    .catch(err => next(err))
}

const removeImage = (filePath) => {
    console.log('filepath', filePath);
    console.log('dirname', __dirname);
    // /home/antasofa/Documents/Online Course/Programming/Youtube/mern/mern-api/
    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log(err));
}