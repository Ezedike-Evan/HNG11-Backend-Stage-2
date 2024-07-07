// accessControl.js
const canAccessOrganization = (user, organizationId) => {
    return user.organizations.includes(organizationId);
  };
  
  module.exports = canAccessOrganization;
  