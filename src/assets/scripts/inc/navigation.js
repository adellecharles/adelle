import debounce from 'lodash/debounce'
import { getWindowDimensions, createFocusTrap } from './utils'

const SELECTORS = {
    nav: '.js-nav',
    menu: '.js-nav-menu',
    toggleBtn: '.js-nav-toggle'
}

const CLASSES = {
    navOpen: 'nav--open',
    navMenuVisible: 'nav__menu--visible'
}

export default class Navigation {
    constructor() {
        this.isOpen = false

        this.nav = document.querySelector(SELECTORS.nav)
        this.menu = this.nav.querySelector(SELECTORS.menu)
        this.toggleBtn = this.nav.querySelector(SELECTORS.toggleBtn)

        this.focusTrap = createFocusTrap(this.nav, {
            toggleElement: this.toggleBtn,
            onEscape: () => this.toggleMenu(false)
        })

        this.bindEvents()
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', () => this.toggleMenu())
        window.addEventListener(
            'resize',
            debounce(Navigation.setScreenDiameter, 200)
        )

        Navigation.setScreenDiameter()
    }

    toggleMenu(force) {
        this.isOpen = typeof force === 'boolean' ? force : !this.isOpen

        this.nav.classList.toggle(CLASSES.navOpen, this.isOpen)
        this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen))

        window.setTimeout(() => {
            this.menu.classList.toggle(CLASSES.navMenuVisible, this.isOpen)
        }, 50)

        if (this.isOpen) {
            this.focusTrap.activate()
        } else {
            this.focusTrap.deactivate()
        }
    }

    static setScreenDiameter() {
        const screen = getWindowDimensions()
        const diameter = Math.sqrt(screen.height ** 2 + screen.width ** 2)
        document.documentElement.style.setProperty(
            '--diameter',
            `${diameter}px`
        )
    }
}