package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.ContactDTO;
import com.project4.JobBoardService.Entity.Contact;
import com.project4.JobBoardService.Repository.ContactRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ContactDTO createContact(Contact contact) {
        Contact savedContact = contactRepository.save(contact);
        return convertToDTO(savedContact);
    }

    @Override
    public List<ContactDTO> getAllContacts() {
        return contactRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ContactDTO getContactById(Long id) {
        return contactRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }


    private ContactDTO convertToDTO(Contact contact) {
        return new ContactDTO(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                contact.getSubject(),
                contact.getMessage(),
                contact.isArchived(),
                contact.getCreatedAt()
        );
    }
    @Override
    public List<ContactDTO> getContactsByArchived(boolean archived) {
        return contactRepository.findByArchived(archived).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
