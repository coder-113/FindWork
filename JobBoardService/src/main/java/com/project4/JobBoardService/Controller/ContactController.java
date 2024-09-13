package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.ContactDTO;
import com.project4.JobBoardService.Entity.Contact;
import com.project4.JobBoardService.Repository.ContactRepository;
import com.project4.JobBoardService.Service.ContactService;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.payload.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {


    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ContactService contactService;

@   PostMapping
    public ResponseEntity<ContactDTO> createContact(@RequestBody Contact contact) {
        ContactDTO createdContact = contactService.createContact(contact);
        String thankYouMessage = "<div style=\"font-family: Arial, sans-serif; padding: 20px; color: #333;\">"
                + "<h2 style=\"color: #2C3E50;\">Thank You, " + contact.getFirstName() + "!</h2>"
                + "<p>We appreciate you reaching out to us. We have received your message:</p>"
                + "<blockquote style=\"background-color: #f9f9f9; border-left: 5px solid #2C3E50; margin: 10px 0; padding: 10px 20px; font-style: italic;\">"
                + contact.getMessage() + "</blockquote>"
                + "<p>Our team will review your message and get back to you shortly.</p>"
                + "<p style=\"margin-top: 20px;\">Best regards,<br/>The Support Team</p>"
                + "</div>";
        try {
            emailService.sendEmail(contact.getEmail(), "Thank You for Your Message", thankYouMessage);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        return ResponseEntity.ok(createdContact);
    }

    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAllContacts() {
        List<ContactDTO> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getContactById(@PathVariable Long id) {
        ContactDTO contact = contactService.getContactById(id);
        if (contact != null) {
            return ResponseEntity.ok(contact);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("showArchive")
    public ResponseEntity<List<ContactDTO>> getContacts(@RequestParam(defaultValue = "false") boolean archived) {
        List<ContactDTO> contacts = archived ? contactService.getContactsByArchived(true) : contactService.getContactsByArchived(false);
        return ResponseEntity.ok(contacts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        String styledMessage = "<div style=\"font-family: Arial, sans-serif; padding: 20px; color: #333;\">"
                + "<h2 style=\"color: #2C3E50;\">" + emailRequest.getSubject() + "</h2>"
                + "<p>" + emailRequest.getMessage() + "</p>"
                + "<p style=\"margin-top: 20px;\">Best regards,<br/>The Support Team</p>"
                + "</div>";

        try {
            emailService.sendEmail(emailRequest.getEmail(), emailRequest.getSubject(), styledMessage);
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email: " + ex.getMessage());
        }
    }

    @PostMapping("/archive/{id}")
    public ResponseEntity<ContactDTO> archiveContact(@PathVariable Long id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isPresent()) {
            Contact contact = contactOpt.get();
            contact.setArchived(true);
            contactRepository.save(contact);

            ContactDTO contactDTO = new ContactDTO();
            contactDTO.setId(contact.getId());
            contactDTO.setFirstName(contact.getFirstName());
            contactDTO.setLastName(contact.getLastName());
            contactDTO.setEmail(contact.getEmail());
            contactDTO.setSubject(contact.getSubject());
            contactDTO.setMessage(contact.getMessage());

            contactDTO.setArchived(contact.isArchived());

            return ResponseEntity.ok(contactDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @PostMapping("/unarchive/{id}")
    public ResponseEntity<ContactDTO> unarchiveContact(@PathVariable Long id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isPresent()) {
            Contact contact = contactOpt.get();
            contact.setArchived(false);
            contactRepository.save(contact);

            ContactDTO contactDTO = new ContactDTO();
            contactDTO.setId(contact.getId());
            contactDTO.setFirstName(contact.getFirstName());
            contactDTO.setLastName(contact.getLastName());
            contactDTO.setEmail(contact.getEmail());
            contactDTO.setSubject(contact.getSubject());
            contactDTO.setMessage(contact.getMessage());
            contactDTO.setArchived(contact.isArchived());

            return ResponseEntity.ok(contactDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}