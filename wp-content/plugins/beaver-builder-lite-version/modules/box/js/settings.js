(() => {
  FLBuilder.registerModuleHelper('box', {
    init: function () {
      FLBuilder.removeHook('didStopDrag', this.togglePlacementFields);
      FLBuilder.addHook('didStopDrag', this.togglePlacementFields);
      this.togglePlacementFields();
    },
    togglePlacementFields: function () {
      requestAnimationFrame(() => {
        const form = jQuery('.fl-builder-settings:visible');
        const nodeId = form.attr('data-node');
        const doc = FLBuilder.UIIFrame.getIFrameWindow().document;
        const element = jQuery( `.fl-node-${ nodeId }`, doc );

        if (element.parent().css('display') !== 'grid') {
          jQuery( '#fl-field-grid_col' ).hide();
          jQuery( '#fl-field-grid_row' ).hide();
        } else {
          jQuery( '#fl-field-grid_col' ).show();
          jQuery( '#fl-field-grid_row' ).show();
        }

        if (element.parent().css('display') !== 'flex') {
          jQuery( '#fl-field-flex' ).hide();
        } else {
          jQuery( '#fl-field-flex' ).show();
        }
      });
    }
  });
})();