$(function () {
    mapboxgl.accessToken = '<Your Access token here>';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: [77.1025, 28.7041],
        zoom: 2
    });

    const addMarkerToPlace = (office) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${office.location}.json?access_token=${mapboxgl.accessToken}`;
        fetch(url)
            .then(data => data.json())
            .then(geoData => {
                new mapboxgl.Marker(createMarker(office))
                    .setLngLat(geoData.features[0].center)
                    .addTo(map);
            });
    }

    const createMarker = (office) => {
        let officesMarkup = ""
        office.offices.forEach((ofc, index) => {
            officesMarkup += `
                <div class="office-slide">
                    <div class="office-img">
                        <img src="${ofc.imageUrl}" />
                    </div>
                    <div class="office-content">
                        <span class="pagination">${index + 1}/${office.offices.length}</span>
                        <h3 class="office-title">${ofc.title}</h3>
                        <p class="office-address"><i class="fa-solid fa-location-dot"></i> ${ofc.address}</p>
                        <p class="office-telephone"><i class="fa-solid fa-phone"></i> ${ofc.tel}</p>
                    </div>
                </div>
            `
        })
        const marker = $(`<div class="marker-wrapper">
                            <div class="marker"></div>
                            <div class="office-wrap">
                                <div class="office-slider">
                                    ${officesMarkup}
                                </div>
                                <div class="button-wrap">
                                    <button class="close"><i class="fa-solid fa-xmark"></i></button>
                                    <button class="prev"><i class="fa-solid fa-arrow-left-long"></i></button>
                                    <button class="next"><i class="fa-solid fa-arrow-right-long"></i></button>
                                </div>
                            </div>
                        </div>`);
        marker.find(".office-slider").slick({
            nextArrow: $(marker).find(".next"),
            prevArrow: $(marker).find(".prev"),
            swipe: false
        })
        marker.find(".marker").click(function () {
            $(this).parent().toggleClass("open");
        });
        marker.find(".close").click(function () {
            $(this).closest(".marker-wrapper").removeClass("open");

        });
        return marker[0];
    }


    fetch("./offices.json")
        .then(data => data.json())
        .then(data => {
            data.offices.forEach((office) => {
                addMarkerToPlace(office);
            })

        });

});

