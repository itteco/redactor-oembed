# Iframely plugin for Redactor

## About

This is a plugin for [Imperavi's Redactor](http://imperavi.com/redactor) editor that allows rich media and image embeds via oEmbed with default API at [Iframely](http://iframely.com) endpoint. 

The plugin recognizes the http links in editor as the user types it and grabs embeds on the fly.

You can either [self-host](https://github.com/itteco/iframely) Iframely, or get the API Key from the [hosted version](http://iframely.com). As a bonus of hosted version, Iframely also gives the responsive embed codes for over 1500 domains.

## Demo

Please, see demo at [http://itteco.github.io/redactor-oembed/](http://itteco.github.io/redactor-oembed/)

## Sample & Config

Example plugin setup configuration (except usual things):

    <!-- Redactor's plugin -->

    <!-- Setup plugin css. -->
    <link rel="stylesheet" href="iframely.css" />
    <!-- Setup iframely redactor plugin. -->
    <script src="iframely.js"></script>

    <!-- Call Redactor -->
    <script type="text/javascript">

        // Setup your iframely endpoint path. The sample is given for cloud version
        $.iframely.defaults.endpoint = 'http://iframe.ly/api/oembed?api_key={YOUR API KEY HERE}';

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

Please, change all links to Redactor and Iframely to your own values. The links given here are just for demo purposes.

## License & Contributing

This plugin is licensed under MIT. [Imperavi's Redactor](http://imperavi.com/redactor) has own license.

Feel free to submit an issue or fork and submit pull-requests with enhancements or fixes.
