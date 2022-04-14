function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function showCard(data, posterLink) {
    $('#movie-list').append(`
    <div class="card m-3 justify-content-center", style="width:18rem;">
        <img src="` + posterLink + `" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">` + data.Title + `</h5>
            <p class="card-text fst-italic">` + toTitleCase(data.Type) + `</p>
            <a href="#" class="btn btn-primary movie-detail" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="` + data.imdbID + `">Details</a>
        </div>
    </div>
    `)
}

function search() {
    $('#movie-list').html('')

    $.ajax({
        url: 'http://www.omdbapi.com',
        type: 'get',
        dataType: 'json',
        data: {
            'apikey': '<APIKEY HERE>',
            's': $('#search-input').val()
        },
        success: function (result) {
            if (result.Response == "True") {
                let movies = result.Search;
                $.each(movies, function (i, data) {
                    if (data.Poster != "N/A") {
                        showCard(data, data.Poster);
                    } else {
                        showCard(data, "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png")
                    }
                });

                // console.log(movies);
            } else {
                $('#movie-list').html(`
                <h2 class="text-center">` + result.Error + `</h2>
                `)
            }
        }
    });
}

function showMovieModal(mov, movCreator) {
    $('.modal-body').html(`
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <img src="` + mov.Poster + `" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <ul class="list-group">
                        <li class="list-group-item list-group-item-info" aria-current="true">` + mov.Title + `</li>
                        <li class = "list-group-item"> (` + (mov.Year).replace(/\–$/, '–now') + `, dir.
                            ` + movCreator + `) </li>
                        <li class="list-group-item">` + mov.Runtime + ` | ` + mov.Genre + ` | ` + mov.Rated + `</li>
                        <li class="list-group-item">` + mov.Actors + `</li>
                        <li class="list-group-item fst-italic">` + mov.Plot + `</li>
                        <li class="list-group-item">` + mov.Awards + `</li>
                    </ul>
                </div>
            </div>
        </div>
    `)
}


$('#search-button').on('click', function () {
    search();
});

$('#search-input').on('keyup', function (e) {
    if (e.which === 13) {
        search();
    }
});

$('#movie-list').on('click', '.movie-detail', function () {
    $.ajax({
        url: 'http://www.omdbapi.com',
        type: 'get',
        dataType: 'json',
        data: {
            'apikey': '<APIKEY HERE>',
            'i': $(this).data('id')
        },
        success: function (mov) {
            if (mov.Response == "True") {
                let imdblink = 'http://imdb.com/title/' + mov.imdbID
                console.log(imdblink)
                $('#go-to-imdb').attr('href', imdblink)
                if (mov.Type == "movie") {
                    showMovieModal(mov, mov.Director)
                } else {
                    showMovieModal(mov, mov.Writer)
                }
            }
        }
    });
});