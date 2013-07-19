/**
 * jquery.nl.fileupload Script by Giraldo Rosales.
 * Version 1.0
 * Visit www.nitrogenlabs.com for documentation and updates.
 *
 *
 * Copyright (c) 2009 Nitrogen Labs, Inc. All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/
 
;(function($){
	if(!$.nl) {
		$.nl	= {};
	}
	
    $.fn.uploader = function(options){
        var base			= this;
        $.nl.uploader		= {};
        $.nl.uploader.tmp	= [];
        
        this.init		= function(){
            base.options	= $.extend({},$.fn.uploader.defaults, options);
            
            //Make sure input names allow for multiple fields
			base.options.inputBase64	= base.options.inputBase64.replace('[]','')+'[]';
			base.options.inputNames		= base.options.inputNames.replace('[]','')+'[]';
			base.options.inputTypes		= base.options.inputTypes.replace('[]','')+'[]';
				
            //Get input
			this.input	= this.find('input[type="file"]');
			this.input.attr('multiple','true');
			
            //Listener
            this.input.change(base.onAddFile);
            
            //Find existing container
            base.list	= $('.uploader');
            
            if(base.list.length == 0) {
				//Create container
				base.list	= $('<div></div>').addClass('uploader').appendTo(this);
			}
			
			$('<ul></ul>').addClass('uploader_list').addClass(base.options.listClass).appendTo(base.list);
			
			return base;
        };
        
        this.onAddFile	= function(e) {
			var files	= $(this)[0].files;
	
			for(var g=0; g<files.length; g++) {
				base.addFiles(files[g]);
			}
	
			return e.preventDefault();
		}

		this.addFiles	= function(file) {
			var reader = new FileReader();
			
			reader.onload = (function(theFile) {
				return function(e) {
					var base64		= e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
					var filename	= theFile.name.toString();
					var filetype	= theFile.type.toString();
					var filesize	= theFile.size.toString();
			
					base.insertRow(filename, filetype, filesize, base64);
				};
			})(file);
			
			reader.readAsDataURL(file);
		}
		
		this.insertRow	= function(name, type, size, base64) {
			var ul	= base.list.find('.uploader_list');
			
			if($.nl.uploader.tmp.indexOf(name) < 0) {
				var row	= $('<li></li>').addClass(base.options.rowClass).appendTo(ul);
				
				if(base.options.imagesOnly) {
					var preview	= $('<div></div>').addClass(base.options.previewClass).appendTo(row);
					$('<img/>').attr('src', 'data:'+type+';base64,'+base64).appendTo(preview);
					$('<div></div>').addClass(base.options.nameClass).html(name).appendTo(row);
				} else {
					$('<div></div>').addClass(base.options.nameClass).html(name).appendTo(row);
				}
				
				$('<div></div>').addClass(base.options.sizeClass).html(base.bytesToSize(size)).appendTo(row);
				var box		= $('<div></div>').addClass(base.options.controlClass).appendTo(row);
				$('<button></button>').addClass(base.options.deleteClass).html(base.options.deleteText).data('name', name).click(base.removeFiles).appendTo(box);
				
				$.nl.uploader.tmp.push(name);
				
				$('<input/>').attr({'type':'hidden', 'name':base.options.inputBase64, value:base64}).appendTo(row);
				$('<input/>').attr({'type':'hidden', 'name':base.options.inputNames, value:name}).appendTo(row);
				$('<input/>').attr({'type':'hidden', 'name':base.options.inputTypes, value:type}).appendTo(row);
				//$.nl.uploader.files[name]	= {'base64':base64, 'name':name, 'type':type};
			}
		}

		this.removeFiles	= function(e) {
			$(this).parent().parent().remove();
			e.preventDefault();
		};
		
		this.bytesToSize	= function(bytes) {
			var sizes = ['bytes', 'kb', 'MB', 'GB', 'TB'];
			if (bytes == 0) return 'n/a';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		};
		
		$.fn.uploader.submit			= function(){
			var form	= $(base.options.formSelector);
			$.post(form.attr('action'), form.serializeArray(), base.options.onComplete, 'json');
		};
		
		base.init();
		
		return base;
    };
    
    $.fn.uploader.defaults = {
        listClass:'',
        formSelector:'',
        inputSelector:'',
        onComplete:null,
        imagesOnly:false,
        inputBase64:'filesBase',
        inputNames:'filesName',
        inputTypes:'filesType',
        deleteText:'Delete',
        rowClass:'row-fluid',
        previewClass:'span1',
        nameClass:'span8',
        sizeClass:'span1',
        controlClass:'span2',
        deleteClass:'btn'
    };
})(jQuery);