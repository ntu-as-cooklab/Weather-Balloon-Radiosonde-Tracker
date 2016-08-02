var Plotly = require('@lib/index');

describe('the register function', function() {
    'use strict';

    var Plots = Plotly.Plots;

    beforeEach(function() {
        this.modulesKeys = Object.keys(Plots.modules);
        this.allTypesKeys = Object.keys(Plots.allTypes);
        this.allCategoriesKeys = Object.keys(Plots.allCategories);
        this.allTransformsKeys = Object.keys(Plots.transformsRegistry);
    });

    afterEach(function() {
        function revertObj(obj, initialKeys) {
            Object.keys(obj).forEach(function(k) {
                if(initialKeys.indexOf(k) === -1) delete obj[k];
            });
        }

        revertObj(Plots.modules, this.modulesKeys);
        revertObj(Plots.allTypes, this.allTypesKeys);
        revertObj(Plots.allCategories, this.allCategoriesKeys);
        revertObj(Plots.transformsRegistry, this.allTransformsKeys);
    });

    it('should throw an error when no argument is given', function() {
        expect(function() {
            Plotly.register();
        }).toThrowError(Error, 'No argument passed to Plotly.register.');
    });

    it('should work with a single module', function() {
        var mockTrace1 = {
            moduleType: 'trace',
            name: 'mockTrace1',
            meta: 'Meta string',
            basePlotModule: { name: 'plotModule' },
            categories: ['categories', 'array']
        };

        expect(function() {
            Plotly.register(mockTrace1);
        }).not.toThrow();

        expect(Plotly.Plots.getModule('mockTrace1')).toBe(mockTrace1);
    });

    it('should work with an array of modules', function() {
        var mockTrace2 = {
            moduleType: 'trace',
            name: 'mockTrace2',
            meta: 'Meta string',
            basePlotModule: { name: 'plotModule' },
            categories: ['categories', 'array']
        };

        expect(function() {
            Plotly.register([mockTrace2]);
        }).not.toThrow();

        expect(Plotly.Plots.getModule('mockTrace2')).toBe(mockTrace2);
    });

    it('should throw an error when an invalid module is given', function() {
        var invalidTrace = { moduleType: 'invalid' };

        expect(function() {
            Plotly.register([invalidTrace]);
        }).toThrowError(Error, 'Invalid module was attempted to be registered!');
    });

    it('should throw when if transform module is invalid', function() {
        var missingTransformName = {
            moduleType: 'transform'
        };

        expect(function() {
            Plotly.register(missingTransformName);
        }).toThrowError(Error, 'Transform module *name* must be a string.');

        var missingTransformFunc = {
            moduleType: 'transform',
            name: 'mah-transform'
        };

        expect(function() {
            Plotly.register(missingTransformFunc);
        }).toThrowError(Error, 'Transform module mah-transform is missing a *transform* function.');

        var transformModule = {
            moduleType: 'transform',
            name: 'mah-transform',
            transform: function() {}
        };

        expect(function() {
            Plotly.register(transformModule);
        }).not.toThrow();

        expect(Plots.transformsRegistry['mah-transform']).toBeDefined();
    });
});
