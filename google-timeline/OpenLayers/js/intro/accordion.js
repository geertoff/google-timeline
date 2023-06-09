function accordionButton() {

    // zoek alle knoppen in de class accordion
    $('.accordion').find('.accordion-button').each(function (i, button) {

        let accordionContent = button.nextElementSibling;

        button.addEventListener('click', function () {
            button.classList.toggle('active-accordion-button');
            if (button.classList.contains('active-accordion-button')) {

                let maxHeight = accordionContent.scrollHeight;
                accordionContent.style.maxHeight = maxHeight + 'px';

            } else {
                accordionContent.style.maxHeight = 0;
            }
        });
    });

}