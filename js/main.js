// =========================================================
// LUKES FIRST GLASS SERVICES LTD
// MAIN JAVASCRIPT
// =========================================================
//
// FEATURES:
// 1. Page fade-in
// 2. Custom gallery image zoom
// 3. Lightbox2 compatibility
// 4. Keyboard accessibility
// 5. Mobile-friendly behaviour
// 6. Proper body scroll locking
//
// IMPORTANT:
// ---------------------------------------------------------
// CUSTOM ZOOM:
// Normal .gallery-item img elements are handled here.
//
// LIGHTBOX2:
// Any image inside:
//
//     <a data-lightbox="...">
//
// is completely ignored by this script.
//
// This allows Lightbox2 to handle Before & After images.
// =========================================================


// =========================================================
// WAIT FOR PAGE TO LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // PAGE FADE-IN
    // =====================================================

    const pageContent = document.querySelector(".page-content");

    if (pageContent) {

        pageContent.classList.add("fade-in");

    }


    // =====================================================
    // CREATE CUSTOM ZOOM MODAL
    // =====================================================

    const zoomModal = document.createElement("div");

    zoomModal.className = "gallery-zoom-modal";

    zoomModal.setAttribute("role", "dialog");

    zoomModal.setAttribute("aria-modal", "true");

    zoomModal.setAttribute("aria-label", "Enlarged gallery image");


    zoomModal.innerHTML = `

        <button
            type="button"
            class="gallery-zoom-close"
            aria-label="Close enlarged image"
        >
            &times;
        </button>

        <div class="gallery-zoom-content">

            <img
                src=""
                alt=""
                draggable="false"
            >

        </div>

    `;


    // Add modal to the page

    document.body.appendChild(zoomModal);


    // =====================================================
    // GET MODAL ELEMENTS
    // =====================================================

    const modalImage =
        zoomModal.querySelector(".gallery-zoom-modal img");


    const closeButton =
        zoomModal.querySelector(".gallery-zoom-close");


    // =====================================================
    // STORE LAST FOCUSED ELEMENT
    // =====================================================

    /*
     * When the modal closes, keyboard focus is returned
     * to the image that opened it.
     */

    let lastFocusedElement = null;


    // =====================================================
    // FIND GALLERY IMAGES
    // =====================================================

    const galleryImages =
        document.querySelectorAll(".gallery-item img");


    // =====================================================
    // SET UP CUSTOM ZOOM
    // =====================================================

    galleryImages.forEach(function (image) {


        // -------------------------------------------------
        // CHECK WHETHER LIGHTBOX2 OWNS THIS IMAGE
        // -------------------------------------------------

        const lightboxLink =
            image.closest("a[data-lightbox]");


        /*
         * If the image is inside a Lightbox2 anchor,
         * DO NOTHING.
         *
         * Lightbox2 handles it instead.
         */

        if (lightboxLink) {

            return;

        }


        // -------------------------------------------------
        // MARK IMAGE AS CUSTOM ZOOM IMAGE
        // -------------------------------------------------

        image.classList.add("custom-zoom-image");


        // -------------------------------------------------
        // MAKE IMAGE KEYBOARD ACCESSIBLE
        // -------------------------------------------------

        /*
         * Images aren't normally keyboard-focusable.
         *
         * Adding tabindex allows users to reach them
         * using the keyboard.
         */

        image.setAttribute("tabindex", "0");


        /*
         * Tell assistive technologies that the image
         * behaves like a button.
         */

        image.setAttribute("role", "button");


        image.setAttribute(
            "aria-label",
            "Enlarge " +
            (image.alt || "gallery image")
        );


        // =================================================
        // OPEN ZOOM WITH MOUSE / TOUCH
        // =================================================

        image.addEventListener("click", function () {

            openZoom(image);

        });


        // =================================================
        // OPEN ZOOM WITH KEYBOARD
        // =================================================

        image.addEventListener("keydown", function (event) {


            // Enter key

            if (event.key === "Enter") {

                event.preventDefault();

                openZoom(image);

            }


            // Space key

            if (event.key === " ") {

                event.preventDefault();

                openZoom(image);

            }

        });

    });


    // =====================================================
    // OPEN CUSTOM ZOOM
    // =====================================================

    function openZoom(image) {


        // -------------------------------------------------
        // Remember the element that opened the modal
        // -------------------------------------------------

        lastFocusedElement = image;


        // -------------------------------------------------
        // Set enlarged image source
        // -------------------------------------------------

        modalImage.src = image.currentSrc || image.src;


        // -------------------------------------------------
        // Set accessible alt text
        // -------------------------------------------------

        modalImage.alt =
            image.alt || "Enlarged gallery image";


        // -------------------------------------------------
        // Show modal
        // -------------------------------------------------

        zoomModal.classList.add("active");


        // -------------------------------------------------
        // Prevent page scrolling
        // -------------------------------------------------

        document.body.classList.add("zoom-open");


        // -------------------------------------------------
        // Prevent background content being accessed
        // -------------------------------------------------

        document.body.setAttribute(
            "data-gallery-zoom-open",
            "true"
        );


        // -------------------------------------------------
        // Move keyboard focus to close button
        // -------------------------------------------------

        /*
         * Small timeout allows the modal to become visible
         * before focus moves to the button.
         */

        window.setTimeout(function () {

            closeButton.focus();

        }, 50);

    }


    // =====================================================
    // CLOSE CUSTOM ZOOM
    // =====================================================

    function closeZoom() {


        // -------------------------------------------------
        // Hide modal
        // -------------------------------------------------

        zoomModal.classList.remove("active");


        // -------------------------------------------------
        // Restore page scrolling
        // -------------------------------------------------

        document.body.classList.remove("zoom-open");


        // -------------------------------------------------
        // Remove modal state
        // -------------------------------------------------

        document.body.removeAttribute(
            "data-gallery-zoom-open"
        );


        // -------------------------------------------------
        // Clear image source after animation begins
        // -------------------------------------------------

        /*
         * Give the closing animation a moment to start
         * before removing the image.
         */

        window.setTimeout(function () {

            if (
                !zoomModal.classList.contains("active")
            ) {

                modalImage.src = "";

                modalImage.alt = "";

            }

        }, 300);


        // -------------------------------------------------
        // Return keyboard focus
        // -------------------------------------------------

        if (lastFocusedElement) {

            window.setTimeout(function () {

                /*
                 * Only focus it if it still exists on
                 * the page.
                 */

                if (
                    document.body.contains(
                        lastFocusedElement
                    )
                ) {

                    lastFocusedElement.focus();

                }

            }, 10);

        }

    }


    // =====================================================
    // CLOSE BUTTON
    // =====================================================

    closeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeZoom();

        }
    );


    // =====================================================
    // CLICK DARK BACKGROUND TO CLOSE
    // =====================================================

    zoomModal.addEventListener(
        "click",
        function (event) {


            /*
             * Only close when the actual background is
             * clicked.
             *
             * Clicking the image itself does not trigger
             * this condition.
             */

            if (event.target === zoomModal) {

                closeZoom();

            }

        }
    );


    // =====================================================
    // CLICK MODAL CONTENT BACKGROUND
    // =====================================================

    const zoomContent =
        zoomModal.querySelector(
            ".gallery-zoom-content"
        );


    zoomContent.addEventListener(
        "click",
        function (event) {


            /*
             * If the empty area surrounding the image
             * is clicked, close the modal.
             */

            if (event.target === zoomContent) {

                closeZoom();

            }

        }
    );


    // =====================================================
    // CLICK ENLARGED IMAGE
    // =====================================================

    modalImage.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            closeZoom();

        }
    );


    // =====================================================
    // ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {


            // -------------------------------------------------
            // Only act if custom zoom is open
            // -------------------------------------------------

            if (
                event.key === "Escape" &&
                zoomModal.classList.contains("active")
            ) {

                event.preventDefault();

                closeZoom();

            }

        }
    );


    // =====================================================
    // BASIC FOCUS MANAGEMENT
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {


            /*
             * Only manage focus while our custom modal
             * is open.
             */

            if (
                !zoomModal.classList.contains("active")
            ) {

                return;

            }


            // -------------------------------------------------
            // TAB KEY
            // -------------------------------------------------

            if (event.key !== "Tab") {

                return;

            }


            /*
             * There is only one interactive control
             * inside our modal: the close button.
             *
             * Keep keyboard focus inside the modal.
             */

            event.preventDefault();

            closeButton.focus();

        }
    );


    // =====================================================
    // HANDLE IMAGE LOAD FAILURE
    // =====================================================

    modalImage.addEventListener(
        "error",
        function () {


            /*
             * If an image cannot load, close the modal
             * instead of leaving the user with a broken
             * image.
             */

            if (
                zoomModal.classList.contains("active")
            ) {

                closeZoom();

            }

        }
    );


    // =====================================================
    // PREVENT ACCIDENTAL IMAGE DRAGGING
    // =====================================================

    galleryImages.forEach(function (image) {


        const lightboxLink =
            image.closest("a[data-lightbox]");


        /*
         * Only apply this to custom zoom images.
         *
         * Don't interfere with Lightbox2.
         */

        if (!lightboxLink) {

            image.addEventListener(
                "dragstart",
                function (event) {

                    event.preventDefault();

                }
            );

        }

    });


    // =====================================================
    // CLEAN UP IF PAGE VISIBILITY CHANGES
    // =====================================================

    /*
     * If the browser/tab is backgrounded while the
     * custom zoom is open, don't leave the page locked
     * if something unusual happens.
     */

    document.addEventListener(
        "visibilitychange",
        function () {


            if (
                document.hidden &&
                zoomModal.classList.contains("active")
            ) {

                closeZoom();

            }

        }
    );


    // =====================================================
    // LIGHTBOX2 COMPATIBILITY
    // =====================================================

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT initialise Lightbox2 here.
     *
     * Lightbox2 is loaded separately in gallery.html:
     *
     * jQuery
     * ↓
     * Lightbox2
     * ↓
     * lightbox.option(...)
     *
     * This script simply leaves:
     *
     *     a[data-lightbox]
     *
     * completely alone.
     */


});


const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile');
});



/* =========================================================
   MOBILE QUICK NAVIGATION DROPDOWN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const quickNav = document.querySelector(".quick-nav");
    const quickNavTitle = quickNav?.querySelector("h2");

    if (!quickNav || !quickNavTitle) return;

    quickNavTitle.addEventListener("click", () => {

        quickNav.classList.toggle("open");

    });

});

// Close Quick Nav when a link is clicked
document.querySelectorAll('.quick-nav-buttons a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.quick-nav').classList.remove('open');
    });
});
