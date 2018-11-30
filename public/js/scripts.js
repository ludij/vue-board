(function() {
    Vue.component("img-modal", {
        props: ["imgid"],
        data: function() {
            return {
                bigimg: [],
                comment: "",
                commenter: "",
                comments: []
            };
        },
        template: "#img-modal",
        mounted: function() {
            this.getImg();
        },
        watch: {
            imgid: function() {
                this.getImg();
            }
        },
        methods: {
            getImg: function() {
                var _this = this;
                return Promise.all([
                    axios.get("/img/" + _this.imgid),
                    axios.get("/comments/" + _this.imgid)
                ])
                    .then(function(response) {
                        if (!response[0].data[0].length)
                            return _this.$emit("closemodal");
                        _this.bigimg = response[0].data[0];
                        _this.comments = response[1].data[0];
                    })
                    .catch(function(err) {
                        console.log(
                            "error in axios get /img/ or /comments/: ",
                            err
                        );
                    });
            },
            clickmodal: function() {
                this.$emit("closemodal");
            },
            submitcomment: function() {
                var _this = this;
                var body = {};
                body.comment = this.comment;
                body.username = this.commenter;
                body.img_id = this.imgid;
                return axios
                    .post("/comment", body)
                    .then(function(newComment) {
                        _this.comments.unshift(newComment.data[0][0]);
                        _this.comment = "";
                        _this.commenter = "";
                    })
                    .catch(function(err) {
                        console.log("error in axios post /upload: ", err);
                    });
            }
        }
    });

    new Vue({
        el: "main",
        data: {
            siteTitle: "Vue Board",
            siteSubTitle: "Upload your own image",
            title: "",
            desc: "",
            username: "",
            file: "",
            fileName: "",
            fileNameClass: "file-upload inline-block",
            imgId: location.hash.slice(1) || null,
            imgs: []
        },
        created: function() {
            document.title = this.siteTitle + " - " + this.siteSubTitle;
            document.head.querySelector("meta[name=description]").content =
                "Image board to upload your own images";
        },
        mounted: function() {
            var _this = this;
            addEventListener("hashchange", function() {
                _this.imgId = location.hash.slice(1);
            });
            this.getImgs();
        },
        methods: {
            getImgs: function() {
                var _this = this;
                if (!this.imgs.length) this.imgs[0] = { id: "all" };
                return axios
                    .get("/imgs/" + this.imgs[this.imgs.length - 1].id)
                    .then(function(response) {
                        _this.imgs =
                            _this.imgs[0].id == "all"
                                ? response.data[0]
                                : _this.imgs.concat(response.data[0]);
                    })
                    .then(function() {
                        if (
                            _this.imgs[0].last_img_id !=
                            _this.imgs[_this.imgs.length - 1].id
                        )
                            infiniteScroll(_this);
                    })
                    .catch(function(err) {
                        console.log("error in axios get /imgs/: ", err);
                    });
            },
            filetoupload: function(e) {
                this.file = e.target.files[0];
                var fileName = e.target.files[0].name;
                var shortFileName =
                    e.target.files[0].name.substring(0, 11) + "...";
                this.fileName = fileName.length > 14 ? shortFileName : fileName;
            },
            upload: function() {
                var _this = this;
                var formData = new FormData();
                formData.append("title", this.title || "No Title");
                formData.append("desc", this.desc || "No description");
                formData.append("username", this.username || "Anonymous");
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function(newImg) {
                        if (newImg.data[0].errorMsg) {
                            if (newImg.data[0].errorMsg == "Too big") {
                                _this.fileName = "2 MB max";
                            }
                            _this.fileNameClass =
                                "blink-red file-upload inline-block";
                            setTimeout(function() {
                                _this.fileNameClass =
                                    "file-upload inline-block";
                            }, 1600);
                        } else {
                            _this.imgs.unshift(newImg.data[0]);
                            _this.title = "";
                            _this.desc = "";
                            _this.username = "";
                            _this.file = "";
                            _this.fileName = "";
                        }
                    })
                    .catch(function(err) {
                        console.log("error in axios post /upload: ", err);
                    });
            },
            clickonimg: function(img) {
                this.imgId = img;
                location.hash = img;
            },
            closemodal: function() {
                this.imgId = null;
                location.hash = "";
            }
        }
    });

    function infiniteScroll(_this) {
        if (
            pageYOffset + innerHeight >
            document.querySelector(".grid").offsetHeight - 500
        ) {
            _this.getImgs();
        } else {
            setTimeout(function() {
                infiniteScroll(_this);
            }, 500);
        }
    }
})();
