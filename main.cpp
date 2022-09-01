#include <iostream>
#include <fstream>
#include <dirent.h>
#include <stdio.h>
#include <string>
#include <sys/stat.h>

using namespace std;

inline string to_lower(string);

bool startChildProcess(const char*, string);

inline bool is_file(const char* path) {
    struct stat buf;
    stat(path, &buf);
    return S_ISREG(buf.st_mode);
}

inline bool is_dir(const char* path) {
    struct stat buf;
    stat(path, &buf);
    return S_ISDIR(buf.st_mode);
}

int main()
{
    const char* PATH;
    string searchWord, inputFolder;

    cout << "Enter Folder Name: ";
    cin >> inputFolder;
    PATH = inputFolder.c_str();
    cout << endl;
    cout << "Enter Search Word: ";
    cin >> searchWord;
    searchWord = to_lower(searchWord);

    startChildProcess(PATH, searchWord);

    return 1;
}

bool startChildProcess(const char* PATH, string searchWord) {
    ofstream outFile;
    ifstream inFile;
    int lineNum, charNum;
    string fullPath, line;

    DIR *dir = opendir(PATH);
    struct dirent *entry = readdir(dir);
    outFile.open("hasSearchWord.txt", ios_base::app | ios_base::out);
    outFile << "=====================================================>" << endl;
    while(entry != NULL) {
        lineNum = 0;
        string FILE(entry->d_name);
        string ROUTE(PATH);
        DIR *subdir = opendir(entry->d_name);
        fullPath = ROUTE + "/" + FILE;
        if(!is_file(fullPath.c_str())) {
            if(FILE != ".." && FILE != ".")
                startChildProcess(fullPath.c_str(), searchWord);
        }
        inFile.open(fullPath.c_str());
        while(getline(inFile, line)) {
            lineNum++;
            line = to_lower(line);
            charNum = line.find(searchWord);
            if(charNum != -1)
                outFile << fullPath << " " << lineNum << ":" << charNum << endl;

        }
        inFile.close();
        entry = readdir(dir);
    }

    outFile.close();
    closedir(dir);

    return 1;
}

string to_lower(string s) {
    for(int i = 0; i < s.length(); i++) {
        if(s[i] >= 'A' && s[i] <= 'Z')
            s[i] += 32;
    }
    return s;
}
