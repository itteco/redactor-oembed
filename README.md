# Iframely plugin for Redactor

## About

This is a plugin for [Imperavi's Redactor](http://imperavi.com/redactor) editor that allows rich media and image embeds via [Iframely gateway](https://github.com/iframely) endpoint.

Please, get your own copy of [Iframely](http://github.com/itteco/iframely) and point this plugin to your own endpoint before launching it into production. The endpoint configured in this plugin by default is Iframely's community endpoint.

## Demo

Please, see demo at [Demo Url](http://itteco.github.io/redactor-iframely-plugin/)

## Sample & Config

Example plugin setup configuration (except usual things):

    <!-- Redactor's plugin -->

    <!-- Setup plugin css. -->
    <link rel="stylesheet" href="iframely.css" />
    <!-- Setup iframely.js lib. -->
    <script src="http://iframely.com/r3/js/iframely.js"></script>
    <!-- Setup iframely redactor plugin. -->
    <script src="iframely.js"></script>

    <!-- Call Redactor -->
    <script type="text/javascript">

        // Setup custom iframely endpoint path.
        // $.iframely.defaults.endpoint = 'http://yourdomain/iframely';

        $(document).ready(function() {
            $('#redactor').redactor({
                focus: true,
                plugins: ['iframely']
            });
        });
    </script>

Plugin modal form html code:

    <!-- iframely Modal HTML -->
    <div id="iframelyModal" style="display: none;">
        <section class="iframely_box">
            <div class="iframely_form">
                <input type="uri" placeholder="enter URI"><button>preview</button>
            </div>
            <div class="results">
            </div>
        </section>
        <footer>
            <a href="#" class="redactor_modal_btn redactor_btn_modal_close">Close</a>
        </footer>
    </div>

Please, change all links to Redactor and Iframely to your own hosted versions. The links given here are just for demo purposes.

## License & Contributing

This plugin is licensed under MIT. [Iframely gateway](https://github.com/itteco/iframely) and [Imperavi's Redactor](http://imperavi.com/redactor) have their own licenses.

Feel free to submit an issue or fork and submit pull-requests with enhancements or fixes.