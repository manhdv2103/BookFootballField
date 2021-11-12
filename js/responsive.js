// Responsive ad modal

const adModal = document.getElementById('ad-modal');
let showModal;
let width = window.innerWidth > 0 ? window.innerWidth : screen.width;
let height = window.innerHeight > 0 ? window.innerHeight : screen.height;
let lastWidth;

function makeAdResponsive(forMobile) {
    let oldClass = 'modal';
    let newClass = 'not-modal';

    if (forMobile) {
        [oldClass, newClass] = [newClass, oldClass];

        adModal.style.display = 'none';
        $('#ad-modal').modal('hide');
        showModal = setTimeout(function () {
            $('#ad-modal').modal('show');
        }, 10000);
    } else {
        document.body.classList.remove('modal-open');
        adModal.style.display = 'block';
        clearTimeout(showModal);
    }

    let modalItems = document.querySelectorAll(`[class*="${oldClass}"]`);
    for (let modalItem of modalItems) {
        let oldClassName = modalItem.className;
        let newClassName = oldClassName.replace(oldClass, newClass);
        modalItem.className = newClassName;
    }
}

makeAdResponsive(width < 992 ? true : false);

window.addEventListener('resize', function () {
    width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    height = window.innerHeight > 0 ? window.innerHeight : screen.height;

    if (width >= 992 && lastWidth < 992) {
        makeAdResponsive(false);
    } else if (width < 992 && lastWidth >= 992) {
        makeAdResponsive(true);
    } else if ((width > 768 && lastWidth <= 768) || width > height) {
        document.getElementById('collapsible-subnav').classList.remove('show');
    }

    lastWidth = width;
});

// Handle clicking outside of mobile navbar

const navBar = document.getElementById('navbar');
const navBarToggler = navBar.getElementsByClassName('navbar-toggler')[0];
const ad = document.getElementById('ad');

function closeNavbarWhenClickOutside(e) {
    const element = e.target;

    if (
        !navBar.contains(element) &&
        !ad.contains(element) &&
        navBarToggler.getAttribute('aria-expanded') === 'true' &&
        width <= 768
    ) {
        navBarToggler.click();
    }
}

window.addEventListener('click', closeNavbarWhenClickOutside);
