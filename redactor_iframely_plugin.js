(function($)
{
    $.Redactor.prototype.iframely = function()
    {
        return {
            langs: {
                en: {
                    'iframely': 'Iframely',
                    'enter-url': 'Enter url to embed'
                }
            },
            getTemplate: function()
            {
				return String()
				+ '<div class="modal-section" id="redactor-modal-iframely-insert">'
					+ '<section>'
						+ '<label>' + this.lang.get('iframely') + '</label>'
						+ '<input type="text" id="redactor-insert-iframely-area" />'
					+ '</section>'
					+ '<section>'
						+ '<button id="redactor-modal-button-action">Insert</button>'
						+ '<button id="redactor-modal-button-cancel">Cancel</button>'
					+ '</section>'
				+ '</div>';
            },
            init: function()
            {
                var button = this.button.addAfter('image', 'iframely', this.lang.get('iframely'));
                this.button.addCallback(button, this.iframely.show);
            },
            show: function()
            {
                this.modal.addTemplate('iframely', this.iframely.getTemplate());

                this.modal.load('iframely', this.lang.get('iframely'), 700);

                // action button
                this.modal.getActionButton().text(this.lang.get('insert')).on('click', this.iframely.insert);
                this.modal.show();

                // focus
                if (this.detect.isDesktop())
                {
                    setTimeout(function()
                    {
                        $('#redactor-insert-iframely-area').focus();

                    }, 1);
                }
            },
            insert: function()
            {
                var that = this;
                var uri = $('#redactor-insert-iframely-area').val();

                this.iframely.fetchUrl(uri, function(error, html) {

                    if (error) {

                        // TODO: show error.

                    } else {

                        that.modal.close();
                        that.placeholder.hide();

                        // buffer
                        that.buffer.set();

                        // insert
                        that.air.collapsed();
                        that.insert.html(html);
                    }
                });
            },

            fetchUrl: function(uri, cb) {

                $.ajax({
                    url: this.opts.oembedEndpoint || 'http://open.iframe.ly/api/oembed',
                    dataType: "json",
                    data: {
                        url: uri,
                        origin: 'redactor'
                    },
                    success: function(data, textStatus, jqXHR) {

                        if (data && data.html) {
                            cb(null, data.html);
                        } else if (data && !data.html && data.type === 'photo' && data.url) {
                            cb(null, '<img src="' + data.url + '" title="' + (data.title || data.url)  + '" alt="' + (data.title || data.url)  + '" />');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR && jqXHR.responseText || textStatus);

                        // TODO: parse responseText.

                        cb(jqXHR && jqXHR.responseText || textStatus);
                    }
                });
            }

        };
    };
})(jQuery);