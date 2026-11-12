Feature: OrangeHRM employee and system user management

  Scenario: Add an employee with valid details
    Given I am logged in as an administrator
    And I open the Add Employee form
    When I save a new employee with unique details
    Then the employee profile is saved

  Scenario: Reject an employee with missing required details
    Given I am logged in as an administrator
    And I open the Add Employee form
    When I submit the employee form without required details
    Then required employee fields are reported

#Addtional test scenarios - not exhaustive list though

  # Scenario: Add a system user for a new employee
  #   Given I am logged in as an administrator
  #   When I add an employee for the new system user
  #   And I open the Add User form
  #   And I create a system user for that employee
  #   Then the system user is listed successfully

  # Scenario: Reject a system user with missing required details
  #   Given I am logged in as an administrator
  #   And I open the Add User form
  #   When I submit the system user form without required details
  #   Then required system-user fields are reported
