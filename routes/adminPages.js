var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

// Get Page model
var Page = require('../models/page');

/*
 * GET pages index
 */
router.get('/', (req, res) => {
    Page.find({}).sort({ sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages
        });
    });
});

/*
 * POST reorder pages
 */
router.post('/reorder-pages', (req, res) => {
    var ids = req.body.id;
    var count = 0;
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        Page.findById(id, (err, page) => {
            page.sorting = count;
            page.save(err => {
                if (err) return console.log(err);
            });
        });
    }
});

/*
 * GET add page
 */
router.get('/add-page', (req, res) => {
    var title = "";
    var slug = "";
    var content = "";
    res.render('admin/addPage', {
        title,
        slug,
        content
    });
});

/*
 * POST add page
 */
router.post('/add-page', 
    [
        check('title', 'Title must have a value').not().isEmpty(),
        check('content', 'Content must have a value').not().isEmpty(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('admin/addPage', {
                errors: errors.array(),
                title,
                slug,
                content
            });
        } else {
            var title = req.body.title;
            var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
            var content = req.body.content;

            if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
            Page.findOne({ slug }, (err, page) => {
                if (page) {
                    req.flash('danger', 'Page slug exists, choose another');
                    res.render('admin/addPage', {
                        title,
                        slug,
                        content
                    });
                } else {
                    var page = new Page({
                        title,
                        slug,
                        content,
                        sorting: 100
                    });
                    page.save(err => {
                        if (err) return console.log(err);
                        req.flash('success', 'Page added');
                        res.redirect('/admin/pages');
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
});

// Exports
module.exports = router;