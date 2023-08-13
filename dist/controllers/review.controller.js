"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.postReview = void 0;
const review_model_1 = require("../models/review.model");
const postReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, review_model_1.Validate)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const newReview = new review_model_1.ReviewModel({
            name: `${req.user._doc.firstName} ${req.user._doc.lastName}`,
            email: req.user._doc.email,
            review: req.body.review
        });
        const saveReview = yield newReview.save();
        res.json({
            status: 'success',
            message: 'Review posted successfully'
        });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send('Failed to save review');
    }
});
exports.postReview = postReview;
const getReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_model_1.ReviewModel.find();
        res.json({
            status: 'success',
            message: 'Reviews fetched successfully',
            data: reviews
        });
    }
    catch (ex) {
        res.status(500).send('Failed to fetch review');
    }
});
exports.getReviews = getReviews;
