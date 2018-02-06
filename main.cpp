#include <iostream>
#include <fstream>
#include <dirent.h>
#include <stdio.h>
#include <string>
#include <sys/stat.h>

using namespace std;

string tolower(string);

bool startChildProcess(const char*, string);

bool is_file(const char* path) {
    struct stat buf;
    stat(path, &buf);
    return S_ISREG(buf.st_mode);
}

bool is_dir(const char* path) {
    struct stat buf;
    stat(path, &buf);
    return S_ISDIR(buf.st_mode);
}

int main()
{
    ifstream inFile;
    ofstream outFile;
    const char* PATH;
    string searchWord, inputFolder;
    string line, fullPath;
    int lineNum, charNum;

    cout << "Enter Folder Name: ";
    cin >> inputFolder;
    PATH = inputFolder.c_str();
    cout << endl;
    cout << "Enter Search Word: ";
    cin >> searchWord;
    searchWord = tolower(searchWord);
    cout << endl;

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
            if(FILE != ".." && FILE != ".") {
                startChildProcess(fullPath.c_str(), searchWord);
            }
        }
        inFile.open(fullPath.c_str());
        while(getline(inFile, line)) {
            lineNum++;
            line = tolower(line);
            charNum = line.find(searchWord);
            if(charNum != -1) {
                outFile << fullPath << " " << lineNum << ":" << charNum << endl;
            }
        }
        inFile.close();
        entry = readdir(dir);
    }
    outFile.close();

    closedir(dir);

    return 0;
}

bool startChildProcess(const char* PATH, string searchWord) {
    ofstream outFile;
    ifstream inFile;
    int lineNum, charNum;
    string fullPath, line;

    DIR *dir = opendir(PATH);
    struct dirent *entry = readdir(dir);
    outFile.open("hasSearchWord.txt", ios_base::app | ios_base::out);
    while(entry != NULL) {
        lineNum = 0;
        string FILE(entry->d_name);
        string ROUTE(PATH);
        DIR *subdir = opendir(entry->d_name);
        fullPath = ROUTE + "/" + FILE;
        if(!is_file(fullPath.c_str())) {
            if(FILE != ".." && FILE != ".") {
                startChildProcess(fullPath.c_str(), searchWord);
            }
        }
        inFile.open(fullPath.c_str());
        while(getline(inFile, line)) {
            lineNum++;
            line = tolower(line);
            charNum = line.find(searchWord);
            if(charNum != -1) {
                outFile << fullPath << " " << lineNum << ":" << charNum << endl;
            }
        }
        inFile.close();
        entry = readdir(dir);
    }
    outFile.close();

    closedir(dir);

    return 1;
}

string tolower(string s) {
    for(int i = 0; i < s.length(); i++) {
        char letter = s[i];
        switch(letter) {
            case 'A':
                s[i] = 'a';
                break;
            case 'B':
                s[i] = 'b';
                break;
            case 'C':
                s[i] = 'c';
                break;
            case 'D':
                s[i] = 'd';
                break;
            case 'E':
                s[i] = 'e';
                break;
            case 'F':
                s[i] = 'f';
                break;
            case 'G':
                s[i] = 'g';
                break;
            case 'H':
                s[i] = 'h';
                break;
            case 'I':
                s[i] = 'i';
                break;
            case 'J':
                s[i] = 'j';
                break;
            case 'K':
                s[i] = 'k';
                break;
            case 'L':
                s[i] = 'l';
                break;
            case 'M':
                s[i] = 'm';
                break;
            case 'N':
                s[i] = 'n';
                break;
            case 'O':
                s[i] = 'o';
                break;
            case 'P':
                s[i] = 'p';
                break;
            case 'Q':
                s[i] = 'q';
                break;
            case 'R':
                s[i] = 'r';
                break;
            case 'S':
                s[i] = 's';
                break;
            case 'T':
                s[i] = 't';
                break;
            case 'U':
                s[i] = 'u';
                break;
            case 'V':
                s[i] = 'v';
                break;
            case 'W':
                s[i] = 'w';
                break;
            case 'X':
                s[i] = 'x';
                break;
            case 'Y':
                s[i] = 'y';
                break;
            case 'Z':
                s[i] = 'z';
                break;
        }
    }
    return s;
}
