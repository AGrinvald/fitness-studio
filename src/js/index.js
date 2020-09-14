
$(document).ready(function() {
    $('.coaches__slider').slick({
        infinite: true,
        nextArrow: $('#nextCoach'),
        prevArrow: $('#prevCoach')
    });

    $('#curriculumAccordion').collapse();
});