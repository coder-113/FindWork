package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.ContactDTO;
import com.project4.JobBoardService.Entity.Contact;
import jakarta.transaction.Transactional;

import java.util.List;

public interface ContactService {
    ContactDTO createContact(Contact contact);
    List<ContactDTO> getAllContacts();
    ContactDTO getContactById(Long id);
    void deleteContact(Long id);

    List<ContactDTO> getContactsByArchived(boolean archived);
}