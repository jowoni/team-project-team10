var searchedPlaces = [];
var addedPlace = [];

function searchPlace(_keyword, _coordinate, _radius) {
    console.log("searchPlace _keyword    : ", _keyword);
    console.log("searchPlace _coordinate : ", _coordinate);
    // radius unit int : M.
    console.log("searchPlace _radius     : ", _radius);
    return new Promise(function (resolve, reject) {
        fetch(`http://165.194.35.214:26756/searchPlace/?keyword=${_keyword}&coordinate=${_coordinate}&radius=${_radius}`)
            .then(function (res) {
                // Response as Promise
                res.json().then(body => {
                    var metaData = JSON.parse(body).meta;
                    var placesData = JSON.parse(body).documents;
                    console.log(metaData);
                    console.log(placesData);
                    resolve(placesData);

                    for (var i = 0; i < placesData.length; i++) {
                        var posit = new daum.maps.LatLng(placesData[i].y, placesData[i].x);
                        var htmlAddresses = [];
                        var contentString2 = [
                            '<div class="iw_inner">',
                            '<h3>' + placesData[i].place_name + '</h3>',
                            '<p>' + placesData[i].address_name + ' | ' + placesData[i].road_address_name + '<br />',
                            placesData[i].phone + '<br />' + '</p>',
                            '</div>'
                        ].join('');

                        if (placesData[i].road_address_name) {
                            htmlAddresses.push('[도로명 주소] ' + placesData[i].road_address_name);
                        }

                        if (placesData[i].address_name) {
                            htmlAddresses.push('[지번 주소] ' + placesData[i].address_name);
                        }

                        if (placesData[i].phone) {
                            htmlAddresses.push('[전화번호] ' + placesData[i].phone);
                        }

                        if (placesData[i].place_name.length > 15) {
                            var contentString = [ // 정보창 내용 set
                                '<div style="padding:10px;min-width:450px;line-height:150%;">',
                                '<h4 style="margin-top:5px;">' + placesData[i].place_name + '</h4><br />',
                                htmlAddresses.join('<br />'),
                                '</div>'
                            ].join('\n');
                        } else {
                            var contentString = [ // 정보창 내용 set
                                '<div style="padding:10px;min-width:330px;line-height:150%;">',
                                '<h4 style="margin-top:5px;">' + placesData[i].place_name + '</h4><br />',
                                htmlAddresses.join('<br />'),
                                '</div>'
                            ].join('\n');
                        }

                        makeMarker(posit, contentString, imageIndex);
                    }
                    if (imageIndex < 5) imageIndex++;
                    else imageIndex = 0;

                }).catch(err => {
                    console.error(err);
                    reject("Error fetching.")
                });
            });
    })
}

function listPlace(_idx, _keyword, _coordinate, _radius) {
    searchPlace(_keyword, _coordinate, _radius).then(function (resolvedData) {
        $('#searchedPlace').empty();

        console.log(resolvedData);
        searchedPlaces = resolvedData;
        for (let i = 0; i < resolvedData.length; i++) {
            let text = `<li class='nav-item'><a class='nav-link' ><span data-feather='file-text'></span>${searchedPlaces[i].place_name}</a></li>`;
            $('#searchedPlace').append(text);
        }
    }).catch(function (err) {
        console.error(err);
    })
}

function appendPlace(i) {
    // 중복 검사 필요함
    let text = `<li class='nav-item'><a class='nav-link' onclick="#"><span data-feather='file-text'></span>${searchedPlaces[i].place_name}</a></li>`;
    $('#addedPlace').append(text);

    addedPlace.push(searchedPlaces[i]);
}
