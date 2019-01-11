/*
 * generated by Xtext 2.15.0
 */
package org.xtext.example.mydsl.formatting2

import com.google.inject.Inject
import org.eclipse.xtext.formatting2.AbstractFormatter2
import org.eclipse.xtext.formatting2.IFormattableDocument
import org.xtext.example.mydsl.person.Person
import org.xtext.example.mydsl.services.PersonGrammarAccess

class PersonFormatter extends AbstractFormatter2 {
	
	@Inject extension PersonGrammarAccess

	def dispatch void format(Person person, extension IFormattableDocument document) {
		// TODO: format HiddenRegions around keywords, attributes, cross references, etc. 
		for (friend : person.friends) {
			friend.format
		}
	}
	
	// TODO: implement for 
}