const express = require("express")
const cors = require("cors")
const Router = express.Router()
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser")

let data = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../model/data.json")))

Router.use(cors())
Router.use(bodyParser.urlencoded({extended : true}))
Router.use(express.urlencoded({extended : true}))

Router.get('/showcomments', (req,res) => {
    return res.status(200).json(data.comments)
})

Router.post("/add/:postId", (req,res) => {
    const { postId } = req.params
    const { text , image } = req.body
    const commentId = Math.floor(Math.random() * 10000)
    const findPostComment = data.comments.findIndex(commentIndex => commentIndex.id == postId)
    if (findPostComment != -1) {
        data.comments.push({commentId, postId, text , image })
        fs.writeFileSync(path.resolve(__dirname , "../model/data.json") , JSON.stringify(data))
        return res.status(200).json(data)
    } else {
        return res.status(404).json({message : "id not found"})
    }    
})

Router.put("/update/:commentId", (req,res) => {
    const { commentId } = req.params
    const { text , image } = req.body
    const findPostComment = data.comments.findIndex(commentIndex => commentIndex.id == commentId)
    if ( findPostComment != -1 ){
        data.comments[findPostComment].text = text || data.comments[findPostComment].text
        data.comments[findPostComment].image = image || data.comments[findPostComment].image
        fs.writeFileSync(path.resolve(__dirname , "../model/data.json") , JSON.stringify(data))
        return res.status(200).json(data)
    }else{
        return res.status(404).json({ message : "comment not found" })
    }  
})

Router.delete("/delete/:commentId", (req,res) => {
    const { commentId } = req.params
    const findPostComment = data.comments.findIndex(commentIndex => commentIndex.id == commentId)
    if ( findPostComment != -1 ) {
        data.comments.splice(findPostComment,1)
        fs.writeFileSync(path.resolve(__dirname , "../model/data.json") , JSON.stringify(data))
        return res.status(200).json(data)
    }else {
        return res.status(404).json({ message : "comment not found" })
    }
})

module.exports = {commentsRouter : Router}