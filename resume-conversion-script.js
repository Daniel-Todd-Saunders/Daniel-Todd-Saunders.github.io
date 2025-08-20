document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("about-me.json");
    const responseJson = await response.json();
    const resume = responseJson.resume;

    const resumeContainer = document.createElement("div");
    
    resumeContainer.classList.add("resume-container");

    resumeContainer.appendChild(buildSidebar(resume));
    resumeContainer.appendChild(buildMain(resume));

    document.body.appendChild(resumeContainer);
  } catch (error) {
    console.log("Failed to load resume:", error);
  }
});

function buildSidebar(resume) {
  const sidebar = document.createElement("div");
  sidebar.id = "side-bar";

  sidebar.appendChild(buildProfile(resume));
  // sidebar.appendChild(buildBio(resume));
  sidebar.appendChild(buildSkills(resume));

  return sidebar;
}

function buildProfile(resume) {
  const profile = document.createElement("div");
  profile.id = "profile";
  
  if (resume.profile != undefined){
    
    if (resume.profile.image) {
      const img = document.createElement("img");
      img.src = resume.profile.image;
      img.alt = "Profile Picture";
      profile.appendChild(img);
    }
  }
  const name = document.createElement("h3");
  name.textContent = resume.profile.name;
  profile.appendChild(name);

  for (const method in resume.profile.contact) {
    const contactMethod = resume.profile.contact[method];
    const div = document.createElement("div");
    div.classList.add("contact");
    
    if (method === "github" || method === "linkedin") {
      div.innerHTML = `<a href="${contactMethod.href}">${contactMethod.text}</a>`;
    } else {
      div.textContent = contactMethod.text;
    }
    profile.appendChild(div);
  }
  
  profile.appendChild(buildBio(resume));

  return profile;
}

function buildBio(resume) {
  const bio = document.createElement("div");
  bio.id = "bio";
  bio.textContent = resume.bio;

  return bio;
}

function buildSkills(resume) {
  const other = "Other";
  const skillSection = document.createElement("div");
  skillSection.id = "skills";

  const header = document.createElement("h3");
  header.textContent = "Skills";
  skillSection.appendChild(header);
  
  const skillGroups = [];
  const otherSkills = []
  
  resume.skills.forEach(skill => {
    const groupName = skill["skill-group"] || other;
    let groupExists = false;
    let foundGroup;
    if (groupName==other) {
      otherSkills.push(skill);
    }
    else{
      skillGroups.forEach(group => {
        if (group.label == groupName) 
        {
          groupExists = true;
          foundGroup = group;
        }
      });
      if (groupExists) {
        foundGroup.items.push(skill);
      }
      else {
        const newGroup = {};
        newGroup.items = [skill];
        newGroup.label = groupName;
        skillGroups.push(newGroup);
      }
    }
    
    
  });

  skillGroups.forEach(group => {
    const skillGroup = document.createElement("div");
    skillGroup.classList.add("skill-group");

    const label = document.createElement("div");
    label.classList.add("skill-label");
    label.textContent = group.label;
    skillGroup.appendChild(label);

    group.items.forEach(skill => {
      skillGroup.appendChild(skillToTag(skill));
    });
    skillSection.appendChild(skillGroup);
  });
  
  otherSkills.forEach(skill => {
    skillSection.appendChild(skillToTag(skill, false));
  });

  return skillSection;
}

function skillToTag(skill, needsPointer = 1) {
  const skillTag = document.createElement("div");
  skillTag.classList.add("skill-item");
  
  if (needsPointer) {
    const skillPointer = document.createElement("span");
    skillPointer.classList.add("skill-pointer");
    // skillPointer.textContent = "";
    skillTag.appendChild(skillPointer);    
  }
  
  const skillTitle = document.createElement("span");
  skillTitle.textContent = skill.title;
  skillTag.appendChild(skillTitle);
  
  //   const skillConnector = document.createElement("span");
  //   skillConnector.classList.add("skill-connector");
  //   skillTag.appendChild(skillConnector);

  //   const skillLevel = document.createElement("span");
  //   skillLevel.textContent = skill.level + " yrs";
  //   skillTag.appendChild(skillLevel);
  
  return skillTag;
}

function buildMain(resume) {
  const main = document.createElement("div");
  main.id = "main";

  main.appendChild(buildSection("Education", resume.courses, buildCourse));
  main.appendChild(buildSection("Work Experience", resume.jobs, buildJob));
  

  return main;
}

function buildSection(title, items, itemBuilder) {
  const section = document.createElement("div");
  const header = document.createElement("h3");
  header.textContent = title;
  section.appendChild(header);

  items.forEach(item => {
    section.appendChild(itemBuilder(item));
  });

  return section;
}

function buildJob(job) {
  const container = document.createElement("div");
  container.classList.add("tile");

  const head = document.createElement("div");
  head.classList.add("tile-header-section");

  const title = document.createElement("div");
  title.classList.add("tile-title-section");

  const position = document.createElement("div");
  position.classList.add("tile-title");
  position.textContent = job.title;
  title.appendChild(position);

  const company = document.createElement("div");
  company.classList.add("tile-subtitle");
  company.textContent = job.company;
  title.appendChild(company);

  head.appendChild(title);

  const dateRange = document.createElement("div");
  dateRange.classList.add("tile-aside");
  dateRange.innerHTML = processDateRange(job.start, job.end)
  head.appendChild(dateRange);

  container.appendChild(head);

  const experienceList = document.createElement("div");
  experienceList.classList.add("tile-body");

  job.responsibilities.forEach(responsibility => {
    const li = document.createElement("div");
    li.classList.add("tile-sub-item");
    li.textContent = responsibility;
    experienceList.appendChild(li);
  });

  container.appendChild(experienceList);
  return container;
}

function processDateRange(start, end) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function formatDate(date) {
    if (!date || !date.month || !date.year) {
      return "Invalid date";
    }
    const monthNum = parseInt(date.month) - 1;
    const month = months[monthNum]; // month is 1-based
    const year = parseInt(date.year);
    return `${month} ${year}`;
  }

  const startStr = formatDate(start);
  const endStr = formatDate(end);

  return `${startStr} - ${endStr}`;
}

function buildCourse(course) {
  const container = document.createElement("div");
  container.classList.add("tile");

  const head = document.createElement("div");
  head.classList.add("tile-header-section");

  const title = document.createElement("div");
  title.classList.add("tile-title-section");

  const name = document.createElement("div");
  name.classList.add("tile-title");
  name.textContent = course.title;
  title.appendChild(name);

  const school = document.createElement("div");
  school.classList.add("tile-subtitle");
  school.textContent = course.school;
  title.appendChild(school);

  head.appendChild(title);

  const year = document.createElement("div");
  year.classList.add("tile-aside");
  year.textContent = course.year;
  head.appendChild(year);

  container.appendChild(head);

  course.descriptions.forEach(description => {
    const li = document.createElement("div");
    li.classList.add("tile-body");
    li.classList.add("tile-sub-item");
    li.textContent = description;
    container.appendChild(li);
  })
  

  return container;
}


