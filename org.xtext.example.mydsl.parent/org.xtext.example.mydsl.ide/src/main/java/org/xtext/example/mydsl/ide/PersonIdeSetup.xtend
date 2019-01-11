/*
 * generated by Xtext 2.15.0
 */
package org.xtext.example.mydsl.ide

import com.google.inject.Guice
import org.eclipse.xtext.util.Modules2
import org.xtext.example.mydsl.PersonRuntimeModule
import org.xtext.example.mydsl.PersonStandaloneSetup

/**
 * Initialization support for running Xtext languages as language servers.
 */
class PersonIdeSetup extends PersonStandaloneSetup {

	override createInjector() {
		Guice.createInjector(Modules2.mixin(new PersonRuntimeModule, new PersonIdeModule))
	}
	
}