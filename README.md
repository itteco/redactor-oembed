# Iframely plugin for Redactor

This plugin adds oEmbed support for [Imperavi's Redactor](http://imperavi.com/redactor) via Iframely API. It providers responsive rich media and image embeds via [Iframely API](http://iframely.com) endpoint, that supports [over 1800](https://iframely.com/domains) publishers and summary cards for the rest of the web. 

You will get YouTube, Twitter, Facebook, Tumblr, Vimeo, SoundCloud, Flickr, Google Maps, GfyCat, Giphy, Imgur, Vimeo - all the usual suspects plus thousands more.

You will need to define oEmbed API endpoint in your settings, see below. For Iframely version, get your API key at [iframely.com](https://iframely.com)

## Demo

Check out the simple plugin's demo on [Imperavi website](https://imperavi.com/redactor/plugins/iframely/).

Get embeds through the dialog via 'Embed' button in Redactor's toolbar. The plugin also tries to recognize http links on a separate in editor as author types it.

## Configure the plugin with API endpoint

    <!-- Setup iframely redactor plugin. -->
    <script src="redactor_iframely_plugin.js"></script>

    <!-- Call Redactor -->
    <script type="text/javascript">
        $(document).ready(function() {
            $('#redactor').redactor({
                // Add 'iframely' to plugins.
                plugins: ['iframely'],

                // Setup your iframely endpoint path. The sample is given for cloud version.
                oembedEndpoint: '//iframe.ly/api/oembed?api_key={YOUR API KEY HERE}'
            });
        });
    </script>

Get your Iframely API key at [iframely.com](https://iframely.com). You can also point the plugin to the [self-hosted Iframely](https://github.com/itteco/iframely) version.


## License & Contributing

This plugin is licensed under MIT. [Imperavi's Redactor](http://imperavi.com/redactor) has own license.

Feel free to submit an issue or fork and submit pull-requests with enhancements or fixes.
