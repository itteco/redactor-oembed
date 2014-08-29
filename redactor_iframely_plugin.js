if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.iframely = {

    init: function() {

        var that = this;

        var urlRe = /^\s*(https?:\/\/[^ \/,"]+\/[^ ,"]+)\s*$/i;

        this.$editor.on('keyup', function(e) {
            if (e.keyCode === 13) {
                var current = that.getCurrent();

                if (current.nodeType === 3) {
                    current = current.parentNode;
                }

                var prev = current.previousSibling;
                if (!prev) {
                    return;
                }
                if (prev.getAttribute && prev.getAttribute('parsed-iframely-link')) {
                    return;
                }
                var text = prev.textContent;
                if (!text) {
                    return;
                }
                var m = text.match(urlRe);
                if (m) {
                    prev.setAttribute('parsed-iframely-link', '1');
                    that.fetchUrl(m[1], prev);
                }
            }
        });
    },

    fetchUrl: function(uri, node) {

        var that = this;

        $.ajax({
            url: 'http://medium.iframe.ly/api/oembed',
            dataType: "json",
            data: {
                url: uri,
                iframe: true
            },
            success: function(data, textStatus, jqXHR) {

                if (data && data.html) {
                    that.insertHtmlAdvanced(data.html);
                }

                node && node.parentNode && node.parentNode.removeChild(node);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(jqXHR && jqXHR.responseText || textStatus);
            }
        });
    }
};