/*
 *  HANDLERS
 *  Contains all functions which handle web requests
 */

//@TODO configure config path

//Dependencies
const config = require('./../config.js');
const fs = require('fs');
const path = require('path');

//Create the container
var handlers = {};

//Index handler
handlers.index = function (data, callback) {
    callback(200, '@TODO create index page, or build redirect', 'html');
};

//Not found handler
handlers.notFound = function (data, callback) {
    callback(404, 'The page you requested is not available', 'html');
};

//Handler for all basic html sites
handlers.html = function (data, callback) {
    fs.readFile(path.join(__dirname, './html/' + data.path + '.html'), 'utf8', function (err, fileData) {
        if (!err && fileData.length > 0) {
            callback(200, fileData, 'html');
        } else {
            fs.readFile(path.join(__dirname, './html/' + data.path + '/index.html'), 'utf8', function (err, fileData) {
                if (!err && fileData.length > 0) {
                    callback(200, fileData, 'html');
                } else {
                    fs.readFile(path.join(__dirname, './html/' + data.path), 'utf8', function (err, fileData) {
                        if (!err && fileData) {
                            callback(200, fileData, 'html');
                        } else {
                            console.log(path.join(__dirname, './html/' + data.path));
                            callback(404, 'html handler couldnt find the file', 'html');
                        }
                    });
                }
            });
        }
    });
};

//Handlers for assets
handlers.assets = function (data, callback) {
    if (data.path.length > 0) {
        //Read in the asset
        fs.readFile(path.join(__dirname, './html/' + data.path), function (err, fileData) {
            console.log(data.path);
            if (!err && fileData) {
                //Choose the contentType and default to plain
                var contentType = 'plain';
                if (data.path.indexOf('.css') > -1) contentType = 'css';
                if (data.path.indexOf('.png') > -1) contentType = 'png';
                if (data.path.indexOf('.jpg') > -1) contentType = 'jpg';
                if (data.path.indexOf('.ico') > -1) contentType = 'favicon';
                if (data.path.indexOf('.ttf') > -1) contentType = 'font';
                callback(200, fileData, contentType);
            } else {
                callback(404);
            }
        });
    }
};

//Export the container
module.exports = handlers;