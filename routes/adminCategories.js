var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

// Get Page model
var Category = require('../models/category');

/*
 * GET pages index
 */
router.get('/', (req, res) => {
    Category.find((err, categories) => {
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

/*
 * GET add category
 */
router.get('/add-category', (req, res) => {
    var title = "";
    res.render('admin/addCategory', {
        title
    });
});

/*
 * POST add category
 */
router.post('/add-category', 
    [
        check('title', 'Title must have a value').not().isEmpty()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('admin/addCategory', {
                errors: errors.array(),
                title
            });
        } else {
            var title = req.body.title;
            slug = title.replace(/\s+/g, '-').toLowerCase();
            Category.findOne({ slug }, (err, category) => {
                if (category) {
                    req.flash('danger', 'Category slug exists, choose another');
                    res.render('admin/addCategory', {
                        title,
                        slug
                    });
                } else {
                    var category = new Category({
                        title,
                        slug
                    });
                    category.save(err => {
                        if (err) return console.log(err);
                        req.flash('success', 'Category added');
                        res.redirect('/admin/categories');
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
});

/*
 * GET edit page
 */
router.get('/edit-page/:slug', (req, res) => {
    Page.findOne({ slug: req.params.slug }, (err, page) => {
        if (err) return console.log(err);
        res.render('admin/editPage', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});

/*
 * POST edit page
 */
router.post('/edit-page/:slug', 
    [
        check('title', 'Title must have a value').not().isEmpty(),
        check('content', 'Content must have a value').not().isEmpty(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('admin/editPage', {
                errors: errors.array(),
                title,
                slug,
                content,
                id
            });
        } else {
            var title = req.body.title;
            var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
            var content = req.body.content;
            var id = req.body.id;
            if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
            Page.findOne({ slug, _id: {'$ne':id} }, (err, page) => {
                if (page) {
                    req.flash('danger', 'Page slug exists, choose another');
                    res.render('admin/editPage', {
                        title,
                        slug,
                        content,
                        id
                    });
                } else {
                    Page.findById(id, (err, page) => {
                        if (err) return console.log(err);
                        page.title = title;
                        page.slug = slug;
                        page.content = content;
                        page.save(err => {
                            if (err) return console.log(err);
                            req.flash('success', 'Page edited');
                            res.redirect('/admin/pages/edit-page/' + page.slug);
                        });
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
});

/*
 * GET delete page
 */
router.get('/delete-page/:id', (req, res) => {
    Page.findByIdAndRemove(req.params.id, err => {
        if (err) return console.log(err);
        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages');
    });
});

// Exports
module.exports = router;