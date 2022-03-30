var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET book page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM book",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("book/list", {
          title: "Peminjaman Buku",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var book = {
        id: req.params.id,
      };

      var delete_sql = "delete from book where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          book,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/book");
            } else {
              req.flash("msg_info", "Delete Book Success");
              res.redirect("/book");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM book where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/book");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "book tidak ditemukan!");
              res.redirect("/book");
            } else {
              console.log(rows);
              res.render("book/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("no", "Please fill the no").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_no            = req.sanitize("no").escape().trim();
      v_judul         = req.sanitize("judul").escape().trim();
      v_penerbit     = req.sanitize("penerbit").escape().trim();
      v_tanggal_pinjam           = req.sanitize("tanggal_pinjam").escape();
      v_no_kartu  = req.sanitize("no_kartu").escape().trim();
      v_tanggal_kembali         = req.sanitize("tanggal_kembali").escape().trim();
      v_status = req.sanitize("status").escape().trim();

      var book = {
        no: v_no,
        judul: v_judul,
        penerbit: v_penerbit,
        tanggal_pinjam: v_tanggal_pinjam,
        no_kartu: v_no_kartu,
        tanggal_kembali: v_tanggal_kembali,
        status: v_status,
      };

      var update_sql = "update book SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          book,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("book/edit", {
                no: req.param("no"),
                judul: req.param("judul"),
                penerbit: req.param("penerbit"),
                tanggal_pinjam: req.param("tanggal_pinjam"),
                no_kartu: req.param("no_kartu"),
                tanggal_kembali: req.param("tanggal_kembali"),
                status: req.param("status"),
              });
            } else {
              req.flash("msg_info", "Update book berhasil");
              res.redirect("/book/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/book/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("no", "Please fill the no").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_no            = req.sanitize("no").escape().trim();
    v_judul         = req.sanitize("judul").escape().trim();
    v_penerbit     = req.sanitize("penerbit").escape().trim();
    v_tanggal_pinjam           = req.sanitize("tanggal_pinjam").escape();
    v_no_kartu  = req.sanitize("no_kartu").escape().trim();
    v_tanggal_kembali         = req.sanitize("tanggal_kembali").escape().trim();
    v_status = req.sanitize("status").escape().trim();

    var book = {
      no: v_no,
      judul: v_judul,
      penerbit: v_penerbit,
      tanggal_pinjam: v_tanggal_pinjam,
      no_kartu: v_no_kartu,
      tanggal_kembali: v_tanggal_kembali,
      status: v_status,
    };

    var insert_sql = "INSERT INTO book SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        book,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("book/add", {
              no: req.param("no"),
              judul: req.param("judul"),
              penerbit: req.param("penerbit"),
              tanggal_pinjam: req.param("tanggal_pinjam"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Data book berhasil dibuat!");
            res.redirect("/book");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("book/add", {
      no: req.param("no"),
      judul: req.param("judul"),
      penerbit: req.param("penerbit"),
      tanggal_pinjam: req.param("tanggal_pinjam"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("book/add", {
    title: "Tambah book",
    no: "",
    judul: "",
    penerbit: "",
    tanggal_pinjam: "",
    tanggal_masuk: "",
    no_kartu: "",
    tanggal_kembali: "",
    status: "",
    session_store: req.session,
  });
});

module.exports = router;
